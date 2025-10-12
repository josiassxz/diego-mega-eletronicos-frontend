
import React from 'react';
import { Input } from './Input';

export const MaskedInput = ({ mask, value, onChange, ...props }) => {
  const applyMask = (inputValue, maskType) => {
    if (!inputValue) return '';
    
    // Remove tudo que não é número
    const numbers = inputValue.replace(/\D/g, '');
    
    switch (maskType) {
      case 'cpf':
        // 000.000.000-00
        return numbers
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
          .substring(0, 14);
      
      case 'phone':
      case 'whatsapp':
        // (00) 00000-0000
        return numbers
          .replace(/(\d{2})(\d)/, '($1) $2')
          .replace(/(\d{5})(\d)/, '$1-$2')
          .substring(0, 15);
      
      case 'cep':
        // 00000-000
        return numbers
          .replace(/(\d{5})(\d)/, '$1-$2')
          .substring(0, 9);
      
      case 'date':
        // DD/MM/AAAA
        return numbers
          .replace(/(\d{2})(\d)/, '$1/$2')
          .replace(/(\d{2})(\d)/, '$1/$2')
          .substring(0, 10);
      
      case 'rg':
        // 00.000.000-0
        return numbers
          .replace(/(\d{2})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d)/, '$1-$2')
          .substring(0, 12);
      
      default:
        return inputValue;
    }
  };
  
  const handleChange = (e) => {
    const maskedValue = applyMask(e.target.value, mask);
    if (onChange) {
      // Emit a synthetic-like minimal event with name and masked value
      onChange({
        target: {
          name: props.name,
          value: maskedValue
        }
      });
    }
  };
  
  return (
    <Input
      {...props}
      value={applyMask(value, mask)}
      onChange={handleChange}
    />
  );
};
