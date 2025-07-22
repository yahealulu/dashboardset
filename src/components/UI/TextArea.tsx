import React, { FC } from 'react';
import { FieldValues, Controller, Control, RegisterOptions } from 'react-hook-form';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // لتحميل ستايل المحرر

const TextEditor: FC<{
  name: string;
  label: string;
  control: Control<FieldValues>;
  rules?: RegisterOptions;
  error?: string;
}> = ({ name, label, control, rules, error }) => {
  return (
    <div className="">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      <div className={`border rounded-lg overflow-hidden ${error ? 'border-red-500' : ''}`}>
        <Controller
          control={control}
          name={name}
          rules={rules}
          render={({ field: { onChange, value } }) => (
            <ReactQuill
              theme="snow"
              value={value || ''}
              onChange={(content) => {
                const plainText = stripHtml(content);
                onChange(plainText); // نرسل فقط النص المجرد للفورم
              }}
              modules={modules}
              formats={formats}
              placeholder={`Enter ${label}`}
              className="h-[200px] resize-y"
            />
          )}
        />
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

// إعدادات التولبار
const modules = {
  toolbar: {
    container: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      ['clean'],
    ],
    handlers: {
      image: imageHandler,
    },
  },
};

// تنسيقات مدعومة
const formats = [
  'header',
  'bold', 'italic', 'underline',
  'list', 'bullet',
  'link', 'image',
];

// رفع الصور بـ base64
function imageHandler(this: any) {
  const input = document.createElement('input');
  input.setAttribute('type', 'file');
  input.setAttribute('accept', 'image/*');
  input.click();

  input.onchange = async () => {
    const file = input.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const base64data = reader.result;
        const range = this.quill.getSelection();
        this.quill.insertEmbed(range.index, 'image', base64data);
      };
    }
  };
}

function stripHtml(html: string): string {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
}

export default TextEditor;
