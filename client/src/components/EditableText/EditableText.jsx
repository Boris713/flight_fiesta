import React, { useState, forwardRef, useImperativeHandle } from "react";
import { FaPencilAlt } from "react-icons/fa";

const EditableText = forwardRef(({ initialText = "", placeholder = "Enter text", className }, ref) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(initialText);

  useImperativeHandle(ref, () => ({
    getText: () => text,
  }));

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className={`${className} d-flex align-items-center justify-content-center`}>
      {isEditing ? (
        <input
          type="text"
          value={text}
          onChange={handleTextChange}
          onBlur={() => setIsEditing(false)}
          placeholder={placeholder}
          autoFocus
          className="form-control"
        />
      ) : (
        <div
          style={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
          onClick={toggleEdit}
        >
          {text || placeholder}
          <button
            style={{
              border: "none",
              background: "none",
              marginLeft: "10px",
              padding: 0,
            }}
          >
            <FaPencilAlt />
          </button>
        </div>
      )}
    </div>
  );
});

export default EditableText;
