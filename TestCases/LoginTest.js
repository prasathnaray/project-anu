import http from 'k6/http';
import { check } from 'k6';

export const options = {
    vus: 20,
    duration: '20s',
};

export function setup() {
    const loginRes = http.post(
        'http://13.205.207.179:4004/api/v1/login',
        JSON.stringify({
            email: 'abiya@gmail.com',
            password: 'test1'
        }),
        { headers: { 'Content-Type': 'application/json' } }
    );

    check(loginRes, {
        'login successful': (r) => r.status === 200,
    });

    const responseBody = JSON.parse(loginRes.body);

    // 👇 THIS is your token
    const token = responseBody.accessToken;

    return token;
}

export default function (token) {

    const res = http.get(
        'http://13.205.207.179:4004/api/v1/trainee/ffe5c81a-aff5-409b-b5b8-2c9f0f3b2fdc?isVr=false',
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    check(res, {
        'protected route success': (r) => r.status === 200,
        'response time < 500ms': (r) => r.timings.duration < 500,
    });
}