"use client";

import React, { useEffect, useRef, useState } from "react";
import numeral from "numeral";
import clsx from "clsx";

type NumberInputProps = {
  value?: number | string | null;
  onChange: (val: number | string | null) => void;
  disabled?: boolean;
  formatOpt?: Partial<typeof defaultConfig>;
  placeholder?: string;
  className?: string;
};

const defaultConfig = {
  max: 999999999,
  min: 0,
  float: false,
  allowNull: false,
  allowLeadingZero: false,
  allowLeadingMultipleZero: false,
  boundaryTransformation: true,
  integerFormat: "0,0",
  floatFormat: "0,0[.][00]",
};

export default function NumberInput({
  value = "",
  onChange,
  disabled = false,
  formatOpt = {},
  placeholder,
  className,
}: NumberInputProps) {
  const config = { ...defaultConfig, ...formatOpt };
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (document.activeElement !== inputRef.current) {
      const formatted = formatValue(value);
      setInputValue(String(formatted ?? ""));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const formatValue = (val: number | string | null | undefined) => {
    if (val === null || val === undefined || val === "") return "";
    return numeral(val).format(
      config.float ? config.floatFormat : config.integerFormat
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const key = e.key;
    const allowedKeys = [
      "Backspace",
      "Delete",
      "Tab",
      "ArrowLeft",
      "ArrowRight",
    ];

    if (!/\d/.test(key) && key !== "." && !allowedKeys.includes(key)) {
      e.preventDefault();
    }

    if (key === "." && !config.float) {
      e.preventDefault();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;

    // Không cho để trống input
    if (raw === "") {
      setInputValue("0");
      onChange(0);
      return;
    }

    const numVal = numeral(raw).value();

    if (numVal === null || isNaN(numVal)) {
      return;
    }

    let safeVal = numVal;

    if (numVal > config.max) {
      safeVal = config.boundaryTransformation ? config.max : numVal;
    }

    if (numVal < config.min) {
      safeVal = config.min;
    }

    onChange(safeVal);
    setInputValue(
      numeral(safeVal).format(
        config.float ? config.floatFormat : config.integerFormat
      )
    );
  };

  const handleBlur = () => {
    const numVal = numeral(inputValue).value();

    if (numVal === null || isNaN(numVal) || numVal < config.min) {
      onChange(config.min);
      setInputValue(String(config.min));
      return;
    }

    const formatted = formatValue(numVal);
    setInputValue(String(formatted));
  };

  return (
    <input
      ref={inputRef}
      type="text"
      className={clsx("number-input form-control", className)}
      value={inputValue}
      onChange={handleChange}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      placeholder={placeholder}
    />
  );
}
