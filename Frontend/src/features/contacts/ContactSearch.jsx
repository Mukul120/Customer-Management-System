import React from 'react';
import Input from '../../components/ui/Input';

export default function ContactSearch({ value, onChange }) {
  return (
    <div style={{ flex: 1, maxWidth: 360 }}>
      <Input
        id="contact-search"
        placeholder="Search by name, phone or email…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        icon={
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        }
      />
    </div>
  );
}
