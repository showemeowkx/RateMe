export const URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

export const fetchData = async (
  url,
  options = { method: "GET" },
  result = true
) => {
  const response = await fetch(url, options);

  if (!response.ok) {
    const data = await response.json();
    const message = data.message || `Error: ${response.status}`;

    const error = new Error("Validation error");
    error.status = response.status;
    error.message = message;
    throw error;
  }

  if (result) {
    return await response.json();
  }
};
