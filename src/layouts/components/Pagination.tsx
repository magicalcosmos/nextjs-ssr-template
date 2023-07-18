import { useState, useEffect, type ChangeEvent } from "react";
import PaginationDemo from "@mui/material/Pagination";
import Box from "@mui/material/Box";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

type TPaginationProps = {
  t: Function;
  page: number;
  perPage?: number;
  total?: number;
  pages?: number[];
  onPageChange?: Function;
  onPerPageChange?: Function;
};

export default function Pagination({ 
  t,
  page, 
  perPage = 10, 
  total = 1,
  pages = [10, 20, 50, 100], 
  onPageChange, 
  onPerPageChange }: TPaginationProps) {
  const [currentPage, setCurrentPage] = useState<number>(page);
  const [currentPerPage, setCurrentPerPage] = useState<number | '' | undefined>(perPage);
  const [count, setCount] = useState<number>();

  const handlePageChange = (event: ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
    typeof onPageChange === 'function' && onPageChange(value);
  }

  const handlePerPageChange = (event: SelectChangeEvent<number | '' | undefined>) => {
    setCurrentPerPage(event.target.value as number);
    typeof onPerPageChange === 'function' && onPerPageChange(event.target.value);
  }

  const handleInputPage = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (isNaN(Number(event.target.value))) {
      return;
    } else {
      if (count && Number(event.target.value) > count) {
        setCurrentPage(count);
      } else if (Number(event.target.value) < 1) {
        return;
      } else {
        setCurrentPage(Number(event.target.value));
        typeof onPageChange === 'function' && onPageChange(Number(event.target.value));
      }
    }
  }

  useEffect(() => {
    setCurrentPerPage(perPage);
    setCount(Math.ceil(total / perPage));
  }, [total, perPage]);
  useEffect(() => {
    setCurrentPage(page);
  }, [page]);

  return (
    <>
      <Box className="define-pagination" sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Typography className="label1">{t('common:per-page')}</Typography>
        <Select
          value={currentPerPage}
          onChange={handlePerPageChange}
        >
          {pages.map((pageItem: number) => (
            <MenuItem key={`perPage${pageItem}`} value={pageItem}>{pageItem}</MenuItem>
          ))}
        </Select>
        <Typography className="label2">{t('common:page-unit')}</Typography>
        <PaginationDemo size="small" count={count} page={currentPage} onChange={handlePageChange} />
        <Typography className="label3">{t('common:to')}</Typography>
        <TextField
          className="to-page"
          value={currentPage}
          onChange={event => handleInputPage(event)}
        ></TextField>
        <Typography className="label2">{t('common:page')}</Typography>
      </Box>
    </>
  );
};
