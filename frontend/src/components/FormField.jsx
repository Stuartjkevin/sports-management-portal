// One labelled form control with its validation message.
// Renders an <input>, a <select> (when options are given) or a <textarea> (as="textarea").
export default function FormField({
  label, name, value, onChange, error, type = 'text', options, placeholder, as, rows = 3, required, helpText, className = 'mb-3', ...rest
}) {
  const id = `field-${name}`;
  const invalid = error ? 'is-invalid' : '';

  let control;
  if (options) {
    control = (
      <select id={id} name={name} value={value} onChange={onChange} className={`form-select ${invalid}`} {...rest}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    );
  } else if (as === 'textarea') {
    control = (
      <textarea id={id} name={name} value={value} onChange={onChange} rows={rows} placeholder={placeholder} className={`form-control ${invalid}`} {...rest} />
    );
  } else {
    control = (
      <input id={id} name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} className={`form-control ${invalid}`} {...rest} />
    );
  }

  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="form-label fw-medium">
          {label}
          {required && <span className="text-danger ms-1">*</span>}
        </label>
      )}
      {control}
      {error ? <div className="invalid-feedback">{error}</div> : helpText && <div className="form-text">{helpText}</div>}
    </div>
  );
}
