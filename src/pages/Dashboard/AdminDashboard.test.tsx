import { render, screen, waitFor } from '@testing-library/react';
import AdminDashboard from './AdminDashboard';
import { supabase } from '../../supabaseClient';
import { vi } from 'vitest';

// Mock the supabase client
vi.mock('../../supabaseClient', () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn(),
  },
}));

describe('AdminDashboard', () => {
  it('calculates totals correctly, accounting for sale quantities', async () => {
    const mockProducts = [
      { id: 1, name: 'Laptop', price: '1500.00' },
      { id: 2, name: 'Mouse', price: '25.00' },
    ];
    const mockSales = [
      { id: 101, product_id: 1, quantity: 2 }, // 2 Laptops
      { id: 102, product_id: 2, quantity: 5 }, // 5 Mice
    ];

    // Setup mock for supabase.from('...').select('...')
    const fromMock = supabase.from as vi.Mock;
    fromMock.mockImplementation((table: string) => {
      if (table === 'products') {
        return {
          select: vi.fn().mockResolvedValue({ data: mockProducts, error: null }),
        };
      }
      if (table === 'sales') {
        return {
          select: vi.fn().mockResolvedValue({ data: mockSales, error: null }),
        };
      }
      return { select: vi.fn().mockResolvedValue({ data: [], error: null }) };
    });

    render(<AdminDashboard />);

    // Wait for calculations to complete
    await waitFor(() => {
      // Subtotal = (1500 * 2) + (25 * 5) = 3000 + 125 = 3125.00
      // VAT = 3125.00 * 0.15 = 468.75
      // Total = 3125.00 + 468.75 = 3593.75
      expect(screen.getByText(/Subtotal: N\$3125.00/i)).toBeInTheDocument();
      expect(screen.getByText(/VAT \(15%\): N\$468.75/i)).toBeInTheDocument();
      expect(screen.getByText(/Total Sales: N\$3593.75/i)).toBeInTheDocument();
    });
  });
});
