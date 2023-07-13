import React from "react";
import renderer from "react-test-renderer";

import Home from "../../src/screens/Home";

describe("Testing Home Screen", () => {
	test("should has three children", () => {
		// @ts-ignore
		const tree = renderer.create(<Home navigation={{}} />).toJSON();
		// @ts-ignore
		expect(tree.children.length).toBe(3);
	});
});
