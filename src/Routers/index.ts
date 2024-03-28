import { Router } from "express";
import fs from "fs";

const path = `${__dirname}`;

const deleteExtensionFile = (file: string): string => {
  return file.split(".").shift() || "";
};

const router = Router();

const routerDinamics = async () => {
  const files = fs.readdirSync(path).filter((item) => {
    const fileOmitWithExtension = deleteExtensionFile(item);
    const extensionNotValid = ["index"].includes(fileOmitWithExtension);
    return !extensionNotValid;
  });

  for (const file of files) {
    const fileOmitWithExtension = deleteExtensionFile(file);
    const routerFile = `/${fileOmitWithExtension}`;
    const filePath = `./${fileOmitWithExtension}`;
    const module = await import(filePath);
    router.use(routerFile, module.default);
  }
};

routerDinamics();

export default router;
