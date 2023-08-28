import React, { useRef, useEffect } from 'react';

function adjustTextareaHeight(textarea) {
  textarea.style.height = 'auto';
  textarea.style.height = `${textarea.scrollHeight}px`;
}

const FormField = ({ labelName, type, name, placeholder, value, handleChange }) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (type === 'textarea' && textareaRef.current) {
      adjustTextareaHeight(textareaRef.current);
    }
  }, [value, type]);

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <label
          htmlFor={name}
          className="block text-sm font-inter font-medium text-gray-900"
        >
          {labelName}
        </label>
      </div>
      {type === 'textarea' ? (
        <textarea
          ref={textareaRef}
          id={name}
          name={name}
          className="bg-gray-50 border border-gray-300 font-inter text-gray-900 text-sm rounded-lg focus:ring-[black] focus:border-[black] outline-none block w-full p-3 resize-none"
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            handleChange(e);
            adjustTextareaHeight(e.target);  // Adjust height on change
          }}
          required
        />
      ) : (
        <input
          type={type}
          id={name}
          name={name}
          className="bg-gray-50 border border-gray-300 font-inter text-gray-900 text-sm rounded-lg focus:ring-[black] focus:border-[black] outline-none block w-full p-3"
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          required
        />
      )}
    </div>
  );
};

export default FormField;

