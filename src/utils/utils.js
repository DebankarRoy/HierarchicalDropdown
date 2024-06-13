export const simplifyData = (data) => {
	const result = {};

	const traverse = (node, parent) => {
		if (
			!node ||
			(node.categoryValue && node.categoryValue.endsWith("_diffnode"))
		) {
			return;
		}

		const categoryId = node.categoryId;
		const categoryValue = node.categoryValue;

		result[categoryId] = {
			id: categoryId,
			name: categoryValue,
			parent: parent,
			children: [],
		};

		if (node.children) {
			for (let key in node.children) {
				traverse(node.children[key], categoryId);
			}
		}
	};

	for (let key in data.relationships) {
		traverse(data.relationships[key], null);
	}

	Object.values(result).forEach((node) => {
		if (node.parent && result[node.parent]) {
			result[node.parent].children.push(node.id);
		}
	});

	return result;
};
export const arraysEqual = (a, b) => {
	if (a.length !== b.length) return false;
	for (let i = 0; i < a.length; i++) {
		if (a[i] !== b[i]) return false;
	}
	return true;
};
