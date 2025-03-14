import clsx from "clsx";
import {
  type ComponentProps,
  useRef,
  useState,
  type ChangeEventHandler,
  type DragEventHandler,
  type PropsWithChildren,
} from "react";

interface IProps
  extends Omit<ComponentProps<"input">, "value" | "onChange" | "type"> {
  onChange: (file: File | null) => void;
}

export default function VideoUpload({
  name = "video-upload",
  onChange,
  children = "Drop video here",
  className,
  ...inputProps
}: PropsWithChildren<IProps>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      onChange(selectedFile);
    }
  };

  const handleDropFile: DragEventHandler<HTMLLabelElement> = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (inputRef.current) {
      inputRef.current.files = e.dataTransfer.files;
    }
    onChange(droppedFile);
    setIsDragOver(false);
  };

  const handleFileDragOver: DragEventHandler<HTMLLabelElement> = (e) => {
    e.preventDefault();
    const draggingFile = e.dataTransfer.items[0];
    console.log(draggingFile);
    setIsDragOver(true);
  };
  const handleFileDragLeave: DragEventHandler<HTMLLabelElement> = () => {
    setIsDragOver(false);
  };
  return (
    <label
      htmlFor={name}
      onDragOver={handleFileDragOver}
      onDrop={handleDropFile}
      onDragLeave={handleFileDragLeave}
      data-is-dragover={isDragOver}
      className={clsx("group size-full", className)}
    >
      <input
        id={name}
        name={name}
        type="file"
        accept="video/*"
        onChange={handleFileChange}
        className="sr-only"
        {...inputProps}
      />
      {children}
    </label>
  );
}
