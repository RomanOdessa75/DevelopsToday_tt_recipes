import { Router } from "express";

import Paths from "@src/common/constants/Paths";
import RecipeRoutes from "./RecipeRoutes";

const apiRouter = Router();

// Add RecipeRouter
apiRouter.use(Paths.Recipes.Base, RecipeRoutes);

export default apiRouter;
