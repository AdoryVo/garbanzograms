import { TLUiActionsContextType, TLUiOverrides, TLUiToolsContextType } from 'tldraw'

// [1]
export const overrides: TLUiOverrides = {
	//[a]
	actions(_editor, actions): TLUiActionsContextType {
		const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
		const letterActions = letters.map((letter) => ({
			id: letter,
			label: letter,
			readonlyOk: true,
			kbd: letter,
			onSelect(source: any) {
				const shapeIds = _editor.getSelectedShapeIds()
				_editor.updateShapes(shapeIds.map((shapeId) => ({id: shapeId, props: { text: letter }, type: "geo"})))
			}
		}))

		for (var action in actions){
			if (actions.hasOwnProperty(action)){
				delete actions[action];
			}
		}

		const newActions = {
			// ...actions,
			// 'toggle-grid': { ...actions['toggle-grid'], kbd: 'x' },
			// 'copy-as-png': { ...actions['copy-as-png'], kbd: '$1' },
			// "add-letter": {
			// 	id: 'add-letter',
			// 	label: 'My new action',
			// 	readonlyOk: true,
			// 	kbd: '$,',
			// 	onSelect(source: any) {
			// 		// Whatever you want to happen when the action is run
			// 		console.log(source)
			// 		const shapes = _editor.getSelectedShapes()
			// 		const shapeIds = _editor.getSelectedShapeIds()
			// 		_editor.updateShapes(shapeIds.map((shapeId) => ({id: shapeId, props: { text: "asdf" }, type: "geo"})))
			// 	},
			// }
			...Object.fromEntries( [...Array(26).keys()].map(index => [letters[index], letterActions[index]]) )
		}

		return newActions
	},
	//[b]
	tools(_editor, tools): TLUiToolsContextType {
		const newTools = { ...tools, draw: { ...tools.draw, kbd: 'p' } }
		return newTools
	},
}