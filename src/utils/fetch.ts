/**
 * 異步呼叫api, 只可用響應體為 json 的 api
 * @param api 要呼叫的api
 * @returns json 結果
 */
export async function asyncGet(api: string):Promise<any>{
    try {
        const res: Response = await fetch(api)
        try {
            return await res.json()
        } catch (error) {
            return error
        }
    } catch (error) {
        return error
    }
}

export async function asyncPost(api: string, body: {} | FormData) {
    const res: Response = await fetch(api, {
        method: 'POST',
        credentials: 'include',
        headers:new Headers({
            'Access-Control-Allow-Origin':"http://localhost:5173/",
            'content-Type':"application/json"
        }),
        body: body instanceof FormData?body:JSON.stringify(body),
        mode:"cors"
    })
    try {
        let data = res.json()
        return data
    } catch (error) {
        console.error(error)
    }
}

export async function asyncPatch(api: string, body: {} | FormData) {
    const res: Response = await fetch(api, {
        method: 'PATCH',
        headers:new Headers({
            'Access-Control-Allow-Origin':"http://localhost:5173/",
        }),
        body: body instanceof FormData?body:JSON.stringify(body),
        mode:"cors"
    })
    try {
        let data = res.json()
        return data
    } catch (error) {
        console.error(error)
    }
}
export async function asyncDelete(api: string, body: {} | FormData) {
    const res: Response = await fetch(api, {
        method: 'DELETE',
        headers:new Headers({
            'Access-Control-Allow-Origin':"http://localhost:5173/",
        }),
        body: body instanceof FormData?body:JSON.stringify(body),
        mode:"cors"
    })
    try {
        let data = res.json()
        return data
    } catch (error) {
        console.error(error)
    }
}
export async function asyncPut(api: string, body: {} | FormData) {
    try {
        const headers = new Headers();
        if (!(body instanceof FormData)) {
            headers.append("Content-Type", "application/json");
        }

        const res: Response = await fetch(api, {
            method: 'PUT',
            headers,
            body: body instanceof FormData ? body : JSON.stringify(body),
            mode: "cors",
        });

        // 檢查回應是否為成功狀態
        if (!res.ok) {
            const errorText = await res.text(); // 嘗試獲取錯誤訊息
            throw new Error(`HTTP Error ${res.status}: ${errorText}`);
        }

        const data = await res.json(); // 確保正確解析 JSON
        return data;
    } catch (error) {
        console.error("Error during PUT request:", error);
        throw error; // 向上拋出錯誤
    }
}

  