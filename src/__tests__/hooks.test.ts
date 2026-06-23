import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useDebounce } from '@/hooks/useDebounce';

describe('useDebounce Hook', () => {
  it('debería debouncear valor después de delay', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'initial' } }
    );

    expect(result.current).toBe('initial');

    rerender({ value: 'updated' });
    expect(result.current).toBe('initial'); // Aún no debounceado

    await waitFor(() => {
      expect(result.current).toBe('updated');
    }, { timeout: 400 });
  });

  it('debería usar delay por defecto de 300ms', async () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value), {
      initialProps: { value: 'test' },
    });

    rerender({ value: 'changed' });
    expect(result.current).toBe('test');

    await waitFor(
      () => {
        expect(result.current).toBe('changed');
      },
      { timeout: 350 }
    );
  });

  it('debería cancelar timeout si valor cambia antes de delay', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'first' } }
    );

    rerender({ value: 'second' });
    rerender({ value: 'third' });
    rerender({ value: 'final' });

    await waitFor(() => {
      expect(result.current).toBe('final');
    }, { timeout: 400 });
  });
});
