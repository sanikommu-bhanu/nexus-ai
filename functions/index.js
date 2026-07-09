/* =====================================================================
   NEXUS AI — CLOUD FUNCTION
   Runs on a schedule (independent of any device being online) and sends
   real push notifications through Firebase Cloud Messaging for any
   reminder whose time has arrived. This is the piece that makes
   reminders work even when the phone/app is completely closed.

   Deploy with: firebase deploy --only functions
   ===================================================================== */

const { onSchedule } = require('firebase-functions/v2/scheduler');
const { initializeApp } = require('firebase-admin/app');
const { getFirestore, Timestamp } = require('firebase-admin/firestore');
const { getMessaging } = require('firebase-admin/messaging');

initializeApp();
const db = getFirestore();

// TODO: replace with your deployed Firebase Hosting URL so tapping a
// notification opens the right place.
const APP_URL = 'https://YOUR_PROJECT_ID.web.app/#calendar';

exports.sendDueReminders = onSchedule('every 5 minutes', async () => {
  const now = Timestamp.now();

  const dueSnap = await db.collection('reminders')
    .where('sent', '==', false)
    .where('sendAt', '<=', now)
    .limit(200)
    .get();

  if (dueSnap.empty) {
    console.log('No due reminders at', now.toDate().toISOString());
    return;
  }

  const tokensSnap = await db.collection('deviceTokens').get();
  const allTokens = tokensSnap.docs.map((d) => d.id);
  const staleTokens = new Set();
  const updates = [];

  for (const doc of dueSnap.docs) {
    const reminder = doc.data();
    const targetTokens = reminder.token ? [reminder.token] : allTokens;

    if (targetTokens.length === 0) {
      updates.push(doc.ref.update({ sent: true, skipped: 'no_registered_device' }));
      continue;
    }

    try {
      const res = await getMessaging().sendEachForMulticast({
        tokens: targetTokens,
        notification: {
          title: reminder.title || 'Nexus AI',
          body: reminder.body || 'You have a reminder.',
        },
        webpush: {
          fcmOptions: { link: APP_URL },
          notification: { icon: '/icons/icon-192.png' },
        },
      });

      res.responses.forEach((r, i) => {
        if (!r.success && /registration-token-not-registered/.test(r.error?.code || '')) {
          staleTokens.add(targetTokens[i]);
        }
      });

      updates.push(doc.ref.update({ sent: true, sentAt: Timestamp.now() }));
    } catch (err) {
      console.error('Failed to send reminder', doc.id, err);
    }
  }

  await Promise.all(updates);

  if (staleTokens.size) {
    await Promise.all(
      Array.from(staleTokens).map((t) => db.collection('deviceTokens').doc(t).delete().catch(() => {}))
    );
  }

  console.log(`Processed ${dueSnap.size} reminder(s), ${staleTokens.size} stale token(s) cleaned up.`);
});
