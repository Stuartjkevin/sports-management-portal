import { useState } from 'react';

// Generic form hook: stores field values, validation errors and submit state.
// validate(values) must return an errors object ({} when valid).
// If onValid throws an ApiError, the server's field errors are shown on the form.
export default function useForm(initialValues, validate) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setValues((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    // Clear the error for a field as soon as the user edits it.
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const setFieldValue = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  // Usage: <form onSubmit={handleSubmit(async (values) => save(values))}>
  const handleSubmit = (onValid) => async (event) => {
    event.preventDefault();
    const found = validate(values);
    setErrors(found);
    setFormError('');
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    try {
      await onValid(values);
    } catch (err) {
      setErrors(err.errors ?? {});
      setFormError(err.message ?? 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const reset = (nextValues = initialValues) => {
    setValues(nextValues);
    setErrors({});
    setFormError('');
  };

  return { values, errors, formError, submitting, handleChange, setFieldValue, handleSubmit, reset };
}
