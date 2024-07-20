import { Router } from "express";
import { promises as fs } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const routerStudio = Router();
const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

const studioFilePath = path.join(_dirname, "../../data/studios.json");

const readStudiosFs = async () => {
    try {
        const studio = await fs.readFile(studioFilePath);
        return JSON.parse(studio);
    } catch (err) {
        throw new Error(`Error en la promesa ${err}`);
    }
};

const writeStudioFs = async (studio) => {
    await fs.writeFile(studioFilePath, JSON.stringify(studio, null, 2));
};

routerStudio.post("/postStudios", async (req, res) => {
    const studios = await readStudiosFs();
    const newStudio = {
        id: studios.length + 1,
        name: req.body.name
    };

    studios.push(newStudio);
    await writeStudioFs(studios);
    res.status(201).send(
        `Studio created successfully ${JSON.stringify(newStudio)}`
    );
});

routerStudio.get("/", async (req, res) => {
    const studios = await readStudiosFs();
    res.json(studios);
});

routerStudio.get("/:studioId", async (req, res) => {
    const studios = await readStudiosFs();
    const studio = studios.find((a) => a.id === parseInt(req.params.studioId));
    if (!studio) return res.status(404).send("studio not found");
    res.json(studio);
});



export default routerStudio;