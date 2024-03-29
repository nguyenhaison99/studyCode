import { Fragment, useRef, useEffect, useLayoutEffect } from "react";
import { Image, Transformer } from "react-konva";
import useImage from "use-image";

const DummyImage = ({ shapeProps, isSelected, onSelect, onChange }) => {
	const [image] = useImage("https://picsum.photos/500");
	const shapeRef = useRef();
	const trRef = useRef();

	useLayoutEffect(() => {
		shapeRef.current.cache();
	}, [image]);

	useEffect(() => {
		if (isSelected) {
			// we need to attach transformer manually
			trRef.current.setNode(shapeRef.current);
			trRef.current.getLayer().batchDraw();
		}
	}, [isSelected]);

	return (
		<Fragment>
			<Image
				image={image}
				onClick={onSelect}
				ref={shapeRef}
				{...shapeProps}
				draggable
				onDragEnd={(e) => {
					onChange({
						...shapeProps,
						x: e.target.x(),
						y: e.target.y(),
					});
				}}
				onTransformEnd={(e) => {
					const node = shapeRef.current;

					onChange({
						...shapeProps,
						x: node.x(),
						y: node.y(),
						scaleX: node.scaleX(),
						scaleY: node.scaleY(),
					});
				}}
			/>
			{isSelected && (
				<Transformer
					ref={trRef}
					boundBoxFunc={(oldBox, newBox) => {
						// limit resize
						if (newBox.width < 5 || newBox.height < 5) {
							return oldBox;
						}
						return newBox;
					}}
				/>
			)}
		</Fragment>
	);
};

export default DummyImage;
