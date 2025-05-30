"use client";

import { useEffect, useState, useDeferredValue } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface RecipeShort {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory?: string;
  strArea?: string;
  strIngredient1?: string;
  strIngredient2?: string;
  strIngredient3?: string;
  [key: string]: string | undefined;
}

export default function RecipesListPage() {
  const [recipes, setRecipes] = useState<RecipeShort[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const searchParams = useSearchParams();

  const initialIngredient = searchParams.get("ingredient") || "";
  const initialCountry = searchParams.get("country") || "";
  const initialCategory = searchParams.get("category") || "";
  const initialSearch = searchParams.get("search") || "";

  const [inputValues, setInputValues] = useState({
    ingredient: initialIngredient,
    country: initialCountry,
    category: initialCategory,
    search: initialSearch,
  });

  const deferredIngredient = useDeferredValue(inputValues.ingredient);
  const deferredCountry = useDeferredValue(inputValues.country);
  const deferredCategory = useDeferredValue(inputValues.category);
  const deferredSearch = useDeferredValue(inputValues.search);

  useEffect(() => {
    const urlIngredient = searchParams.get("ingredient") || "";
    const urlCountry = searchParams.get("country") || "";
    const urlCategory = searchParams.get("category") || "";
    const urlSearch = searchParams.get("search") || "";

    if (
      urlIngredient !== inputValues.ingredient ||
      urlCountry !== inputValues.country ||
      urlCategory !== inputValues.category ||
      urlSearch !== inputValues.search
    ) {
      setInputValues({
        ingredient: urlIngredient,
        country: urlCountry,
        category: urlCategory,
        search: urlSearch,
      });
    }
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    setError("");

    const apiParams = new URLSearchParams();

    if (deferredSearch) apiParams.append("search", deferredSearch);
    if (deferredIngredient) apiParams.append("ingredient", deferredIngredient);
    if (deferredCountry) apiParams.append("country", deferredCountry);
    if (deferredCategory) apiParams.append("category", deferredCategory);

    fetch(`${API_URL}api/recipes?${apiParams.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setRecipes(data.meals || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Error loading recipes");
        setLoading(false);
      });

    const urlParams = new URLSearchParams(window.location.search);
    let urlNeedsUpdate = false;

    if ((urlParams.get("search") || "") !== deferredSearch) {
      urlNeedsUpdate = true;
    }
    if ((urlParams.get("ingredient") || "") !== deferredIngredient) {
      urlNeedsUpdate = true;
    }
    if ((urlParams.get("country") || "") !== deferredCountry) {
      urlNeedsUpdate = true;
    }
    if ((urlParams.get("category") || "") !== deferredCategory) {
      urlNeedsUpdate = true;
    }

    if (urlNeedsUpdate) {
      const newParams = new URLSearchParams();
      if (deferredSearch) newParams.append("search", deferredSearch);
      if (deferredIngredient)
        newParams.append("ingredient", deferredIngredient);
      if (deferredCountry) newParams.append("country", deferredCountry);
      if (deferredCategory) newParams.append("category", deferredCategory);

      const newUrl = `/recipes${newParams.toString() ? "?" + newParams.toString() : ""}`;
      window.history.replaceState({}, "", newUrl);
    }
  }, [deferredSearch, deferredIngredient, deferredCountry, deferredCategory]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Recipe List</h1>
      <div className="flex flex-wrap gap-4 mb-8">
        <input
          className="border p-2 rounded"
          placeholder="Search by name"
          value={inputValues.search}
          onChange={(e) =>
            setInputValues((prev) => ({ ...prev, search: e.target.value }))
          }
        />
        <input
          className="border p-2 rounded"
          placeholder="Filter by ingredient"
          value={inputValues.ingredient}
          onChange={(e) =>
            setInputValues((prev) => ({ ...prev, ingredient: e.target.value }))
          }
        />
        <input
          className="border p-2 rounded"
          placeholder="Filter by country"
          value={inputValues.country}
          onChange={(e) =>
            setInputValues((prev) => ({ ...prev, country: e.target.value }))
          }
        />
        <input
          className="border p-2 rounded"
          placeholder="Filter by category"
          value={inputValues.category}
          onChange={(e) =>
            setInputValues((prev) => ({ ...prev, category: e.target.value }))
          }
        />
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : recipes.length === 0 ? (
        <div>No recipes found</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {recipes.map((r: RecipeShort) => (
            <Link
              key={r.idMeal}
              href={`/recipes/${r.idMeal}`}
              className="block bg-white rounded shadow hover:shadow-lg transition overflow-hidden"
            >
              <Image
                src={r.strMealThumb}
                alt={r.strMeal}
                width={800}
                height={600}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 font-semibold text-lg">{r.strMeal}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
