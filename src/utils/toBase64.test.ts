import { describe, it, expect, vi } from 'vitest';
import { toBase64 } from './toBase64';

describe('toBase64', () => {
  it('converts file to base64 successfully', async () => {
    const file = new File(['dummy'], 'test.png', { type: 'image/png' });

    const mockResult = 'data:image/png;base64,TEST_BASE64';

    const spy = vi
      .spyOn(FileReader.prototype, 'readAsDataURL')
      .mockImplementation(function (this: FileReader) {
        setTimeout(() => {
          Object.defineProperty(this, 'result', {
            value: mockResult,
          });

          this.onload?.(new ProgressEvent('load') as ProgressEvent<FileReader>);
        }, 0);
      });

    const promise = toBase64(file);

    const result = await promise;

    expect(result).toBe(mockResult);
    expect(spy).toHaveBeenCalledWith(file);

    spy.mockRestore();
  });

  it('rejects when file reading fails', async () => {
    const file = new File(['dummy'], 'test.png', { type: 'image/png' });

    const spy = vi
      .spyOn(FileReader.prototype, 'readAsDataURL')
      .mockImplementation(function (this: FileReader) {
        setTimeout(() => {
          this.onerror?.(
            new ProgressEvent('error') as ProgressEvent<FileReader>
          );
        }, 0);
      });

    const promise = toBase64(file);

    await expect(promise).rejects.toThrow('File reading failed');

    expect(spy).toHaveBeenCalledWith(file);

    spy.mockRestore();
  });
});
