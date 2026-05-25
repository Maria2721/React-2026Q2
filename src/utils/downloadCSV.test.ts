import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { downloadCSV } from './downloadCSV';

describe('downloadCSV', () => {
  const mockUrl = 'blob:http://localhost/mock-url';

  beforeEach(() => {
    vi.spyOn(URL, 'createObjectURL').mockReturnValue(mockUrl);

    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});

    document.body.append = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('creates blob URL and triggers download', () => {
    const clickMock = vi.fn();

    const appendSpy = vi.spyOn(document.body, 'append');

    const removeMock = vi.fn();

    const createElementSpy = vi
      .spyOn(document, 'createElement')
      .mockImplementation(() => {
        return {
          click: clickMock,
          remove: removeMock,
          set href(_: string) {},
          set download(_: string) {},
        } as unknown as HTMLAnchorElement;
      });

    const content = 'ID,Name\n1,Rick';
    const fileName = 'test.csv';

    downloadCSV(content, fileName);

    expect(URL.createObjectURL).toHaveBeenCalledTimes(1);

    expect(createElementSpy).toHaveBeenCalledWith('a');

    expect(appendSpy).toHaveBeenCalled();

    expect(clickMock).toHaveBeenCalledTimes(1);

    expect(URL.revokeObjectURL).toHaveBeenCalledWith(mockUrl);
  });

  it('passes correct blob content type', () => {
    const blobSpy = vi.spyOn(globalThis, 'Blob');

    const clickMock = vi.fn();

    vi.spyOn(document, 'createElement').mockReturnValue({
      click: clickMock,
      remove: vi.fn(),
      href: '',
      download: '',
    } as unknown as HTMLAnchorElement);

    downloadCSV('test', 'file.csv');

    expect(blobSpy).toHaveBeenCalledWith(
      ['test'],
      expect.objectContaining({
        type: 'text/csv;charset=utf-8;',
      })
    );
  });
});
