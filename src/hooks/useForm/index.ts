"use client";

import { useState, useCallback } from "react";

export function useForm<T extends Record<string, unknown>>(
  initialValues: T
) {
  const [formData, setFormData] = useState<T>(initialValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const handleChange = useCallback(
    <K extends keyof T>(name: K, value: T[K]) => {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      // Clear error when user starts typing
      if (errors[name]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    },
    [errors]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      handleChange(name as keyof T, value as T[keyof T]);
    },
    [handleChange]
  );

  const setFieldValue = useCallback(<K extends keyof T>(name: K, value: T[K]) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const setFieldError = useCallback(
    <K extends keyof T>(name: K, error: string) => {
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    },
    []
  );

  const reset = useCallback(() => {
    setFormData(initialValues);
    setErrors({});
    setIsSubmitting(false);
  }, [initialValues]);

  const validate = useCallback(
    (validator?: (data: T) => Partial<Record<keyof T, string>>) => {
      if (validator) {
        const validationErrors = validator(formData);
        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
      }
      return true;
    },
    [formData]
  );

  return {
    formData,
    setFormData,
    isSubmitting,
    setIsSubmitting,
    errors,
    setErrors,
    handleChange,
    handleInputChange,
    setFieldValue,
    setFieldError,
    reset,
    validate,
  };
}

