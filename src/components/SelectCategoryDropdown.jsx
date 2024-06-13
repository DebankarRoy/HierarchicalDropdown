import { useEffect, useState } from "react";
import { arraysEqual } from "../utils/utils";
const SelectCategoryDropdown = ({
	selectedCategories,
	onChange,
	categoriesMap,
	categories,
}) => {
	const [showDropdown, setShowDropdown] = useState(false);

	const [openCategories, setOpenCategories] = useState(() => {
		const openCategoriesInitialState = {};
		for (const categoryId in categoriesMap) {
			openCategoriesInitialState[categoryId] = true;
		}
		return openCategoriesInitialState;
	});
	useEffect(() => {
		const newSelectedCategories = checkAllParents(selectedCategories);
		if (!arraysEqual(newSelectedCategories, selectedCategories)) {
			onChange(newSelectedCategories);
		}
	}, [selectedCategories]);

	const handleToggle = (categoryId) => {
		setOpenCategories((prevState) => ({
			...prevState,
			[categoryId]: !prevState[categoryId],
		}));
	};

	const handleSelect = (categoryId) => {
		let newSelectedCategories = [...selectedCategories];
		const index = newSelectedCategories.indexOf(categoryId);

		if (index === -1) {
			// Select parent and all children if not already selected
			newSelectedCategories.push(categoryId);
			addChildrenToSelection(categoryId, newSelectedCategories);
			selectParent(categoryId, newSelectedCategories);
		} else {
			// Deselect parent and all children
			newSelectedCategories = newSelectedCategories.filter(
				(id) => id !== categoryId
			);
			newSelectedCategories = removeChildrenFromSelection(
				categoryId,
				newSelectedCategories
			);
			deselectParent(categoryId, newSelectedCategories);
		}

		onChange(newSelectedCategories);
	};

	const addChildrenToSelection = (categoryId, selection) => {
		const category = categoriesMap[categoryId];
		if (category && category.children) {
			category.children.forEach((childId) => {
				if (!selection.includes(childId)) {
					selection.push(childId);
					addChildrenToSelection(childId, selection);
				}
			});
		}
	};

	const removeChildrenFromSelection = (categoryId, selection) => {
		const category = categoriesMap[categoryId];
		if (category && category.children) {
			category.children.forEach((childId) => {
				selection = selection.filter((id) => id !== childId);
				selection = removeChildrenFromSelection(childId, selection);
			});
		}
		// remove the parent category if no other children are selected
		deselectParent(categoryId, selection);

		return selection;
	};

	const selectParent = (categoryId, selection) => {
		const parent = categoriesMap[categoryId]?.parent;
		if (parent && !selection.includes(parent)) {
			const children = categoriesMap[parent]?.children || [];
			const allChildrenSelected = children.every((childId) =>
				selection.includes(childId)
			);
			if (allChildrenSelected) {
				selection.push(parent);
				selectParent(parent, selection);
			}
		}
	};

	const deselectParent = (categoryId, selection) => {
		const parent = categoriesMap[categoryId]?.parent;
		if (parent) {
			const children = categoriesMap[parent]?.children || [];
			const hasSelectedChild = children.some((child) =>
				selection.includes(child)
			);
			if (!hasSelectedChild) {
				selection = selection.filter((id) => id !== parent);
				deselectParent(parent, selection);
			}
		}
	};

	const checkAllParents = (selection) => {
		let newSelectedCategories = [...selection];

		for (let categoryId in categoriesMap) {
			const category = categoriesMap[categoryId];
			if (
				category.parent &&
				areAllChildrenSelected(category.parent, newSelectedCategories)
			) {
				if (!newSelectedCategories.includes(category.parent)) {
					newSelectedCategories.push(category.parent);
				}
			} else {
				newSelectedCategories = newSelectedCategories.filter(
					(id) => id !== category.parent
				);
			}
		}

		return newSelectedCategories;
	};

	const areAllChildrenSelected = (categoryId, selection) => {
		const category = categoriesMap[categoryId];
		if (!category || !category.children || category.children.length === 0) {
			return false;
		}

		const allChildrenSelected = category.children.every((childId) =>
			selection.includes(childId)
		);

		return allChildrenSelected;
	};

	const isSomeChildSelected = (categoryId, selection) => {
		const category = categoriesMap[categoryId];
		if (!category || !category.children || category.children.length === 0) {
			return false;
		}

		const someChildSelected = category.children.some((childId) =>
			selection.includes(childId)
		);

		return someChildSelected;
	};

	const renderCategory = (categoryId, level = 0) => {
		const category = categoriesMap[categoryId];
		if (!category) return null;

		const someChildSelected = isSomeChildSelected(
			category.id,
			selectedCategories
		);
		const allChildrenSelected = areAllChildrenSelected(
			category.id,
			selectedCategories
		);
		return (
			<div key={category.id} className={`category ml-2 p-2 select-none`}>
				<div className="flex items-center gap-1">
					<div
						className={`flex h-4 w-4 cursor-pointer border  rounded-[4px] ${
							someChildSelected && !allChildrenSelected
								? "bg-slate-500 border-slate-500"
								: "border-black"
						} ${
							selectedCategories.includes(category.id)
								? "bg-black border-black"
								: "border-black"
						}`}
						onClick={() => handleSelect(category.id)}
					>
						<input
							type="checkbox"
							checked={selectedCategories.includes(category.id)}
							onChange={() => handleSelect(category.id)}
							className="hidden"
						/>
						{(someChildSelected && !allChildrenSelected) ||
						selectedCategories.includes(category.id) ? (
							<img src="./assets/tick.svg" />
						) : null}
					</div>
					<div
						className="category-name flex items-center gap-1"
						onClick={() => handleToggle(category.id)}
					>
						<span>{category.name}</span>
						{category.children.length > 0 && (
							<span className="cursor-pointer">
								<img
									className={`h-3 w-3 transform transition-transform duration-300 ${
										!openCategories[category.id] ? "-rotate-90" : ""
									}`}
									src="./assets/down.svg"
								/>
							</span>
						)}
					</div>
				</div>

				{openCategories[category.id] && (
					<div className="category-children ml-5 pl-2">
						{category.children.map((childId) =>
							renderCategory(childId, level + 1)
						)}
					</div>
				)}
			</div>
		);
	};

	const rootCategories = Object.keys(categoriesMap).filter(
		(id) => !categoriesMap[id].parent
	);
	const getSelectedLabels = () => {
		let tempLabelArr = [];
		selectedCategories.forEach((item) => {
			tempLabelArr.push(categories[item]);
		});
		return tempLabelArr.join(",");
	};
	return (
		<>
			<div className="flex flex-col justify-center items-center">
				<div
					className="shadow-custom mt-10 mb-2 p-2 rounded-lg w-[250px] truncate"
					onClick={() => setShowDropdown(!showDropdown)}
				>
					{selectedCategories.length === 0
						? "Select Categories"
						: getSelectedLabels()}
				</div>
				{showDropdown ? (
					<div className="shadow-custom list-container w-[400px] p-4 rounded-xl max-h-[400px] overflow-auto">
						<div className="dropdown">
							{rootCategories.map((rootId) => renderCategory(rootId))}
						</div>
					</div>
				) : null}
			</div>
		</>
	);
};
export default SelectCategoryDropdown;
