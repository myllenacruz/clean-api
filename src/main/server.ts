import app from "@main/config/app";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.info(`Server is running on port ${PORT}`);
});