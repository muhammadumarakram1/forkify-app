import { TIMEOUT_SEC } from "./config";
import { async } from 'regenerator-runtime/runtime';

const timeout = function (s) {
    return new Promise(function (_, reject) {
        setTimeout(function () {
            reject(new Error(`Request took too long! Timeout after ${s} second`));
        }, s * 1000);
    });
};


export async function AJAX(url, uploadData = undefined) {
    try {
        const fetchPro = uploadData ? fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(uploadData),
        }) : fetch(url);
        const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
        const data = await res.json();
        if (!res.ok) throw new Error(`${data.message} (${res.status})`);
        return data;
    } catch (error) {
        throw error;
    }
}

// export async function getJSON(url) {
//     try {
//         const res = await Promise.race([, timeout(TIMEOUT_SEC)]);
//         const data = await res.json();
//         if (!res.ok) throw new Error(`${data.message} (${res.status})`);
//         return data;
//     } catch (error) {
//         throw error;
//     }
// };
// export async function sendJSON(url, uploadData) {
//     try {
//         const fetchPro = 
//         const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
//         const data = await res.json();
//         if (!res.ok) throw new Error(`${data.message} (${res.status})`);
//         return data;
//     } catch (error) {
//         throw error;
//     }
// };