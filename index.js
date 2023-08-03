const express = require("express");
// const openai = require("openai");
const { Configuration, OpenAIApi } = require("openai");

require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT || 8000;

const app = express();
app.use(express.json());
app.use(cors());
// Routes (Endpoints)
app.get("/", (req, res) => {
	res.send("Base Endpoint");
});

//OpenAI Config
const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

app.post("/query", async (req, res) => {
	try {
		const { word } = req.body;
		const prompt = `write a quote around the word '${word}' of 4 lines.
						and give me the result as an object as follows.

						
							[hindi result,english result]
		`;

		// console.log(query);
		const response = await openai.createCompletion({
			model: "text-davinci-003",
			prompt,
			max_tokens: 300,
			temperature: 0.7, // Adjust the value to control the randomness of the generated text
			//   stop: "\n",
		});

		let data = response.data.choices[0].text;
		// console.log(data);

		res.status(200).json({ result: data.trim().split("\n").join("") });
	} catch (error) {
		console.log(error);
		res.status(400).json({ msg: error.message });
	}
});

app.listen(port, () => {
	console.log(`Listening @ ${port}`);
});
