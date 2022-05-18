import request from "@/utils/request";

export function getUserInfo(userId) {
    request
        .get(
            "/living/user/" + userId + "/info",

            {
                path: {
                    userId: Number(userId),
                },
                headers: {
                    "content-type": "application/x-www-form-urlencoded",
                },
            }
        )
        .then((res) => {
            let userInfo = res.data;
            if (res.code == "00000") { return userInfo }
            else {
                return
            }
        });
}