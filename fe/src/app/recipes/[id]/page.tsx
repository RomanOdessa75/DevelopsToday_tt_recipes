import Link from "next/link";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface Recipe {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strTags: string | null;
  strYoutube: string | null;
  [key: string]: string | null | undefined;
}

interface Props {
  params: Promise<{ id: string }>;
}

export default async function RecipeInfoPage({ params }: Props) {
  const { id } = await params;
  let recipe: Recipe | null = null;
  let sidebar: Recipe[] = [];
  let error = "";
  try {
    const res = await fetch(`${API_URL}api/recipes/${id}`);
    const data = await res.json();
    recipe = data.meals?.[0] || null;
    if (recipe?.strCategory) {
      const res2 = await fetch(
        `${API_URL}api/recipes?category=${encodeURIComponent(recipe.strCategory)}`
      );
      const data2 = await res2.json();
      sidebar = data2.meals || [];
    }
  } catch {
    error = "Ошибка загрузки рецепта";
  }

  if (error || !recipe)
    return <div className="text-red-500">{error || "Recipe not found"}</div>;

  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ing = recipe[`strIngredient${i}`];
    const measure = recipe[`strMeasure${i}`];
    if (ing && ing.trim()) {
      ingredients.push({ name: ing, measure });
    }
  }

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="flex-1">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <Image
            src={recipe.strMealThumb}
            alt={recipe.strMeal}
            width={800}
            height={800}
            className="w-64 h-64 object-cover rounded shadow"
          />
          <div className="flex-1 flex flex-col items-center sm:items-start">
            <h1 className="text-3xl font-bold mb-2 text-center sm:text-left">
              {recipe.strMeal}
            </h1>
            <Link
              href={`/recipes?country=${encodeURIComponent(recipe.strArea)}`}
              className="text-blue-600 hover:underline mb-2"
            >
              {recipe.strArea}
            </Link>
            <div className="mb-4 text-gray-700 whitespace-pre-line text-center sm:text-left">
              {recipe.strInstructions}
            </div>
            <h2 className="text-xl font-semibold mb-2">Ingredients</h2>
            <ul className="flex flex-wrap gap-2">
              {ingredients.map((ing, idx) => (
                <li key={idx}>
                  <Link
                    href={`/recipes?ingredient=${encodeURIComponent(ing.name)}`}
                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200"
                  >
                    {ing.name}{" "}
                    {ing.measure && (
                      <span className="text-gray-500">({ing.measure})</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <aside className="w-full md:w-72 bg-white rounded shadow p-4 h-fit">
        <h3 className="text-lg font-bold mb-4">
          Recipes in category: {recipe.strCategory}
        </h3>
        <ul className="space-y-2">
          {sidebar.map((r) => (
            <li key={r.idMeal}>
              <Link
                href={`/recipes/${r.idMeal}`}
                className="block hover:underline text-blue-700"
              >
                {r.strMeal}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-4">
          <Link
            href={`/recipes?category=${encodeURIComponent(recipe.strCategory)}`}
            className="text-blue-600 hover:underline"
          >
            View all in category
          </Link>
        </div>
      </aside>
    </div>
  );
}
