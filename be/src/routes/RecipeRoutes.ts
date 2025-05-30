import { Router, Request, Response } from "express";
import axios from "axios";
import ENV from "@src/common/constants/ENV";
import Paths from "@src/common/constants/Paths";

const router = Router();

router.get(Paths.Recipes.List, async (req: Request, res: Response) => {
  try {
    const { ingredient, country, category, search } = req.query;

    const searchUrl = `${ENV.BaseUrl}search.php?s=${search || ""}`;
    const searchResponse = await axios.get(searchUrl);
    let meals = searchResponse.data.meals || [];

    if (meals.length > 0) {
      const lookupPromises = meals.map(async (meal: any) => {
        if (!meal.strArea || !meal.strCategory) {
          try {
            const lookupUrl = `${ENV.BaseUrl}lookup.php?i=${meal.idMeal}`;
            const lookupResponse = await axios.get(lookupUrl);
            return lookupResponse.data.meals?.[0] || meal;
          } catch (error) {
            console.error(
              `Failed to lookup details for ${meal.idMeal}:`,
              error
            );
            return meal;
          }
        }
        return meal;
      });

      meals = await Promise.all(lookupPromises);

      if (ingredient) {
        const ingredientStr = (ingredient as string).toLowerCase();
        meals = meals.filter((meal: any) => {
          for (let i = 1; i <= 20; i++) {
            const ingredientKey = `strIngredient${i}`;
            if (
              meal[ingredientKey] &&
              meal[ingredientKey].toLowerCase().includes(ingredientStr)
            ) {
              return true;
            }
          }
          return false;
        });
      }

      if (country) {
        const countryStr = (country as string).toLowerCase();
        meals = meals.filter(
          (meal: any) =>
            meal.strArea && meal.strArea.toLowerCase().includes(countryStr)
        );
      }

      if (category) {
        const categoryStr = (category as string).toLowerCase();
        meals = meals.filter(
          (meal: any) =>
            meal.strCategory &&
            meal.strCategory.toLowerCase().includes(categoryStr)
        );
      }
    }

    if (meals.length === 0) {
      let specificUrl = "";

      if (ingredient) {
        specificUrl = `${ENV.BaseUrl}filter.php?i=${ingredient}`;
      } else if (country) {
        specificUrl = `${ENV.BaseUrl}filter.php?a=${country}`;
      } else if (category) {
        specificUrl = `${ENV.BaseUrl}filter.php?c=${category}`;
      }

      if (specificUrl) {
        const specificResponse = await axios.get(specificUrl);
        const specificMeals = specificResponse.data.meals || [];

        if (specificMeals.length > 0) {
          const detailPromises = specificMeals.map(async (meal: any) => {
            try {
              const lookupUrl = `${ENV.BaseUrl}lookup.php?i=${meal.idMeal}`;
              const lookupResponse = await axios.get(lookupUrl);
              return lookupResponse.data.meals?.[0] || meal;
            } catch (error) {
              console.error(
                `Failed to lookup details for ${meal.idMeal}:`,
                error
              );
              return meal;
            }
          });

          meals = await Promise.all(detailPromises);
        }
      }
    }

    res.json({ meals });
  } catch (error) {
    console.error("Failed to fetch or filter recipes:", error);
    res.status(500).json({ error: "Failed to fetch or filter recipes" });
  }
});

router.get(Paths.Recipes.Info, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const url = `${ENV.BaseUrl}lookup.php?i=${id}`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch recipe info" });
  }
});

export default router;
