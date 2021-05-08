const list = document.querySelector(".list");
const reqUrl = document.getElementById("reqUrl");
const responseInfo = document.getElementById("resCode");
const reqBodyText = document.getElementById("reqBody");
const resOutput = document.getElementById("myTextarea");
const apiUrl = "http://localhost:3000";

const fetchFromApi = (httpMethod) => async (endPoint, rest) => {
	let dataToPost;
	if (!(httpMethod == "POST")) {
		reqBodyText.value = "";
	}
	if (endPoint === "/api/users/") {
		dataToPost = {
			name: "rohit",
			pilotingscore: "54",
			shootingScore: "61",
			isForceUser: "true",
		};
	} else if (endPoint === "/api/users/419ac304-6d30-40de-9b84-23592b47c2f5") {
		if (httpMethod === "PUT") {
			dataToPost = {
				name: "lamar",
				pilotingScore: 13,
			};
		} else if (httpMethod === "PATCH")
			dataToPost = {
				name: "Bruce",
			};
	} else if (endPoint === "/api/register") {
		if (rest === 0) {
			dataToPost = {
				email: "test2@test.com",
				password: "test2",
			};
		} else {
			dataToPost = {
				email: "test2@test.com",
			};
		}
	} else if (endPoint === "/api/login") {
		if (rest === 0) {
			dataToPost = {
				email: "test@test.com",
				password: "test",
			};
		} else {
			dataToPost = {
				email: "test2@test.com",
			};
		}
	}

	if (httpMethod === "DELETE") {
		const res = await fetch(`${apiUrl}${endPoint}`, {
			method: httpMethod,
		});
		const { ok, status, url } = res;
		const data = "";
		dataToPost = {};
		return { data, status, ok, url };
	}
	const res = await fetch(`${apiUrl}${endPoint}`, {
		method: httpMethod,
		body: JSON.stringify(dataToPost),
		headers: { "Content-type": "application/json; charset=UTF-8" },
	});
	const { ok, status, url } = res;
	const { data } = await res.json();
	return { data, status, ok, url, dataToPost };
};

const apiMap = {
	1: fetchFromApi("GET"),
	2: fetchFromApi("GET"),
	3: fetchFromApi("GET"),
	4: fetchFromApi("POST"),
	5: fetchFromApi("PUT"),
	6: fetchFromApi("PATCH"),
	7: fetchFromApi("DELETE"),
	8: fetchFromApi("POST"),
	9: fetchFromApi("POST"),
	10: fetchFromApi("POST"),
	11: fetchFromApi("POST"),
	12: fetchFromApi("GET"),
};

const callAPI = (apiNum, endPoint) => {
	if (apiNum == "8") return apiMap[apiNum](endPoint, 0);
	else if (apiNum == "9") return apiMap[apiNum](endPoint, 1);
	else if (apiNum == "10") return apiMap[apiNum](endPoint, 0);
	else if (apiNum == "11") return apiMap[apiNum](endPoint, 1);
	return apiMap[apiNum](endPoint);
};

document.addEventListener("DOMContentLoaded", console.log("dom is readyy"));
document.querySelectorAll(".api").forEach((item) => {
	item.addEventListener("click", async (e) => {
		e.preventDefault();

		const apiEndPoint = e.target.getAttribute("href");
		const apiResult = await callAPI(
			e.target.classList[1].split("-")[1],
			apiEndPoint
		);

		const { data, status, ok, dataToPost } = apiResult;
		if (dataToPost) {
			reqBodyText.value = JSON.stringify(dataToPost, undefined, 4);
		}
		if (ok) {
			if (status == "204") {
				resOutput.value = "";
				responseInfo.value = "";
			}
			resOutput.value = JSON.stringify(data, undefined, 4);
			reqUrl.textContent = apiEndPoint;
			responseInfo.textContent = status;
			responseInfo.style.color = "green";
		} else {
			resOutput.value = "";
			responseInfo.textContent = status;
			responseInfo.style.color = "red";
		}
	});
});
