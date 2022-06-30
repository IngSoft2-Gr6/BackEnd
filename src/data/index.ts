import db from "@models/index";

const generate = async (
	name: keyof typeof db.Models | (keyof typeof db.Models)[]
): Promise<void> => {
	// if name if an array, generate all models in the array
	if (Array.isArray(name)) {
		for (const modelName of name) {
			await generate(modelName);
		}
		return;
	}

	await (db.Models[name] as any).bulkCreate(require(`./${name}`).data, {
		updateOnDuplicate: ["id"],
	});

	console.log(`${name} generated`);
};

export default generate;
