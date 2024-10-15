import { Editor } from "@tinymce/tinymce-react";
import { DEFAULT_RTE_TEXT } from "../../Constants/constants";

export default function RTE({
    defaultValue = DEFAULT_RTE_TEXT,
    onChange = null,
    height = 450,
    width = "full",
}) {
    return (
        <div className="w-full h-full">
            <Editor
                apiKey="j9kfm3dyfhatgtujh4rx6vidqe9j7otmi2ij6rjr3yqmpwa8"
                initialValue={defaultValue}
                onEditorChange={onChange}
                init={{
                    menubar: true,
                    height: height,
                    widht: width,
                    plugins: [
                        "image",
                        "advlist",
                        "autolink",
                        "lists",
                        "link",
                        "charmap",
                        "preview",
                        "searchreplace",
                        "visualblocks",
                        "code",
                        "fullscreen",
                        "insertdatetime",
                        "media",
                        "table",
                        "help",
                        "wordcount",
                        "anchor",
                    ],
                    toolbar: `undo redo | blocks fontfamily fontsize image | bold italic underline strikethrough forecolor | alignleft aligncenter alignright alignjustify | spellcheckdialog a11ycheck typography | bullist numlist outdent indent | emoticons charmap | removeformat | help`,
                    content_style:
                        "body { font-family: Helvetica, Arial, sans-serif; font-size:14px; }",
                }}
            />
        </div>
    );
}
