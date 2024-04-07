import { render, screen } from '@testing-library/react';
import LoadingState from '.';

describe('<LoadingState />', () => {
  it('should render loading icon correctly', () => {
    render(<LoadingState />);
    const loadingIcon = screen.getByRole('img', { name: /icon-label/i });
    expect(loadingIcon).toHaveClass('i-mdi-loading');
  });
});
