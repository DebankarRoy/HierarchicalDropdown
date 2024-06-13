import relationships from "./json/relationships.json";
import categories from "./json/categories.json";
import React, { useState } from "react";
import "./App.css";
import { simplifyData } from "./utils/utils";
import SelectCategoryDropdown from "./components/SelectCategoryDropdown";

const App = () => {
	const [selectedCategories, setSelectedCategories] = useState([]);
	const categoriesMap = simplifyData(relationships);
	const handleCategoriesChange = (newSelectedCategories) => {
		setSelectedCategories(newSelectedCategories);
	};

	return (
		<SelectCategoryDropdown
			selectedCategories={selectedCategories}
			onChange={handleCategoriesChange}
			categoriesMap={categoriesMap}
			categories={categories}
		/>
	);
};

export default App;
