import { getSchema } from "../../source"
import start from "fartest"
import { Types } from "../../source/types/Type/Types"
import { Path } from "../../source/types/Path/Path"

start("Generics", async ({ stage, test, same }) => {
	const schema = getSchema({
		files: ["test/samples/generics.ts"],
	})
	// console.dir(schema, { depth: null })

	for (const [declarationName, generic] of Object.entries(schema)) {
		const [stageName, genericsCount] = declarationName.split("_")
		stage(stageName)
		same(+genericsCount, Object.keys(generic.generics ?? {}).length)

		if (stageName == "Function") {
			const func = generic as Types["Function"]
			for (const signature of func.signatures) {
				for (const parameter of signature.parameters) {
					same((parameter as Types["Reference"])?.path?.[1]?.kind, "generic")
				}
				same((signature.returnType as Types["Reference"])?.path?.[1]?.kind, "generic")
			}
		} else if (stageName == "Circular") {
			const circular = generic as any
			same(circular.generics.C1, { typeName: "Object", properties: {} })
			same(circular.properties.self.generics.C2, { typeName: "Object", properties: {} })
			same(circular.properties.self.signatures[0].returnType, {
				typeName: "Reference",
				path: [{ kind: "declaration", id: generic.id }],
				typeParameters: [
					{
						typeName: "Reference",
						path: [
							{ kind: "declaration", id: generic.id },
							{ kind: "property", name: "self" },
							{ kind: "generic", name: "C2" },
						],
					},
				],
			})
		} else if (stageName == "Constraint") {
			const object = generic as Types["Object"]
			for (const [propertyName, property] of Object.entries(object.properties)) {
				same(property.typeName, propertyName)
			}
		} else {
			const object = generic as Types["Object"]
			for (const [propertyName, property] of Object.entries(object.properties)) {
				const reference = property as Types["Reference"]
				same(reference.typeName, "Reference")
				same(reference.path, <Path>[
					{ kind: "declaration", id: generic.id },
					{ kind: "generic", name: propertyName },
				])
			}
		}
	}
})
