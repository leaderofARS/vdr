const BASE_URL = 'http://localhost:3001';

/**
 * Extract Set-Cookie header value from a fetch response.
 * Returns the raw cookie string to pass in subsequent requests.
 */
function extractCookie(response) {
    const setCookie = response.headers.get('set-cookie');
    if (!setCookie) return '';
    // Extract just the cookie key=value pair (before the first semicolon)
    return setCookie.split(';')[0];
}

async function runTest() {
    try {
        console.log("--- Starting Security Regression Test (Native Fetch) ---");

        // 1. Setup User A
        const userA = { email: 'a@test.com', password: 'StrongPassword123!' };
        await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userA)
        }).catch(() => { });

        const loginARes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userA)
        });
        const cookieA = extractCookie(loginARes);
        console.log("User A logged in.");

        const orgARes = await fetch(`${BASE_URL}/organizations`, {
            method: 'POST',
            headers: {
                'Cookie': cookieA,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: 'Org A', solanaPubkey: 'FxNzogprmve9aubt4B6VT21DKBbERz47cYYQnuF9Xgi5' })
        });
        const orgAData = await orgARes.json();
        const orgAId = orgAData.id || (await fetch(`${BASE_URL}/organizations/my`, { headers: { 'Cookie': cookieA } }).then(r => r.json()))[0]?.id;
        console.log(`Org A ID: ${orgAId}`);

        const keyARes = await fetch(`${BASE_URL}/auth/api-key`, {
            method: 'POST',
            headers: {
                'Cookie': cookieA,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: 'Key A', organizationId: orgAId })
        });
        const keyAData = await keyARes.json();
        const keyA = keyAData.apiKey;
        console.log("Key A generated.");

        // 2. Setup User B
        const userB = { email: 'b@test.com', password: 'StrongPassword123!' };
        await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userB)
        }).catch(() => { });

        const loginBRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userB)
        });
        const cookieB = extractCookie(loginBRes);
        console.log("User B logged in.");

        const orgBRes = await fetch(`${BASE_URL}/organizations`, {
            method: 'POST',
            headers: {
                'Cookie': cookieB,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: 'Org B', solanaPubkey: '2TodmqUTcNcwGvHQwK1pY2L7t9WAzeqnXnQGWJ9HUVYz' })
        });
        const orgBData = await orgBRes.json();
        const orgBId = orgBData.id || (await fetch(`${BASE_URL}/organizations/my`, { headers: { 'Cookie': cookieB } }).then(r => r.json()))[0]?.id;
        console.log(`Org B ID: ${orgBId}`);

        const keyBRes = await fetch(`${BASE_URL}/auth/api-key`, {
            method: 'POST',
            headers: {
                'Cookie': cookieB,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: 'Key B', organizationId: orgBId })
        });
        const keyBData = await keyBRes.json();
        const keyB = keyBData.apiKey;
        console.log("Key B generated.");

        // 3. User A queues a job
        const batchRes = await fetch(`${BASE_URL}/api/batch-register`, {
            method: 'POST',
            headers: {
                'x-api-key': keyA,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ hashes: ["0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"] })
        });
        const batchData = await batchRes.json();
        const jobId = batchData.jobId;
        console.log(`Job Created by Org A: ${jobId}`);

        // 4. User B attempts to access User A's job
        console.log(`\nAttempting cross-org access (Org B -> Job A)...`);
        const statusResB = await fetch(`${BASE_URL}/api/batch-status/${jobId}`, {
            headers: { 'x-api-key': keyB }
        });

        if (statusResB.status === 403) {
            console.log("PASS: Org B was blocked with 403 Forbidden.");
        } else {
            console.log(`FAIL: Org B access status: ${statusResB.status}`);
            const data = await statusResB.json();
            console.log(data);
        }

        // 5. User A verifies their own job
        console.log(`\nVerifying own-org access (Org A -> Job A)...`);
        const statusResA = await fetch(`${BASE_URL}/api/batch-status/${jobId}`, {
            headers: { 'x-api-key': keyA }
        });

        if (statusResA.status === 200) {
            console.log("PASS: Org A can access own job.");
        } else {
            console.log(`FAIL: Org A access status: ${statusResA.status}`);
        }

    } catch (error) {
        console.error("Test execution failed:", error.message);
    }
}

runTest();

