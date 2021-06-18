import React from 'react'
import { createStyles, makeStyles } from '@material-ui/styles'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TablePagination from '@material-ui/core/TablePagination'
import TableRow from '@material-ui/core/TableRow'
import Toolbar from '@material-ui/core/Toolbar'
import Chip from '@material-ui/core/Chip'
import { Button, IconButton, lighten, Theme, Box, Typography } from '@material-ui/core'

import ClearAllIcon from '@material-ui/icons/ClearAll'

interface CompareProductsProps {
  products: any
  productsProperties: any
}

function CompareProducts(props: CompareProductsProps) {
  const { products, productsProperties } = props
  const [firstProduct, secondProduct] = products
  return (
    <TableRow>
      {productsProperties.map(({ name: productProperty }) => {
        if (!firstProduct[productProperty] && !secondProduct[productProperty]) {
          return <TableCell align="center" key={productProperty} />
        }
        if (productProperty === 'name') {
          return (
            <TableCell align="center" key={productProperty}>
              {`${firstProduct.name}`} vs
              <br />
              {`${secondProduct.name}`}
            </TableCell>
          )
        }
        if (productProperty === 'tags') {
          return <TableCell align="center" key={productProperty}>{`${firstProduct.tags?.join(', ') ?? '-'}`}</TableCell>
        }
        return (
          <TableCell align="center" key={productProperty}>
            <Chip
              size="small"
              color="secondary"
              label={firstProduct[productProperty] ?? '-'}
              style={{ textDecoration: 'line-through', marginRight: '.25rem' }}
            />
            <Chip size="small" color="primary" label={secondProduct[productProperty] ?? '-'} />
          </TableCell>
        )
      })}
    </TableRow>
  )
}

interface EnhancedTableProps {
  classes: ReturnType<typeof useStyles>
  numSelected: number
  rowCount: number
  properties: any
  compared: any
  selected: any
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { properties, compared, selected } = props
  return (
    <TableHead>
      <TableRow>
        {properties.map((property) => (
          <TableCell key={property.id} align="center" style={{ minWidth: 130 }}>
            {property.label}
          </TableCell>
        ))}
      </TableRow>
      {}
      {compared && selected.length == 2 ? <CompareProducts products={selected} productsProperties={properties} /> : []}
    </TableHead>
  )
}

const useToolbarStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3)
    },
    highlight:
      theme.palette.type === 'light'
        ? {
            color: theme.palette.secondary.main,
            backgroundColor: lighten(theme.palette.secondary.light, 0.55)
          }
        : {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.secondary.dark
          },
    title: {
      flex: '1 1 100%'
    },
    left: {
      display: 'flex',
      'flex-grow': '1 ',
      'justify-content': 'flex-end'
    }
  })
)

interface EnhancedTableToolbarProps {
  numSelected: number
  selected: any
  setSelected: any
  setCompared: any
  compared: any
  product: any
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const classes = useToolbarStyles()
  // eslint-disable-next-line prefer-const
  const { numSelected, setSelected, setCompared } = props
  const handleClear = () => {
    const newSelected: string[] = []
    setSelected(newSelected)
    setCompared(false)
  }

  // setCompared(newSelected)
  const showSelected = () => {
    setCompared(true)
  }
  // setCompared(selected)

  return (
    <Toolbar className={classes.root}>
      {numSelected > 0 ? (
        <Box>
          <IconButton onClick={() => handleClear()}>
            <ClearAllIcon />
          </IconButton>
        </Box>
      ) : (
        <Box>
          <IconButton>
            <ClearAllIcon />
          </IconButton>
        </Box>
      )}
      {numSelected > 0 ? <Typography>{numSelected} products selected</Typography> : ''}
      {numSelected > 1 && numSelected < 3 ? (
        <Box className={classes.left}>
          <Button
            onClick={() => {
              showSelected()
            }}
            variant="contained"
          >
            Compare products
          </Button>
        </Box>
      ) : (
        <Box className={classes.left}>
          <Button disabled variant="contained" style={{ width: 400 }}>
            select 2 products to compare
          </Button>
        </Box>
      )}
    </Toolbar>
  )
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%'
    },
    container: {
      maxHeight: 440
    },
    paper: {
      width: '100%',
      marginBottom: theme.spacing(2)
    },
    table: {
      minWidth: 750
    },
    visuallyHidden: {
      border: 0,
      clip: 'rect(0 0 0 0)',
      height: 1,
      margin: -1,
      overflow: 'hidden',
      padding: 0,
      position: 'absolute',
      top: 20,
      width: 1
    }
  })
)

export default function ProductsTable({ productProperties, products }) {
  const classes = useStyles()

  const [selected, setSelected] = React.useState<string[]>([])
  const [compared, setCompared] = React.useState(false)
  const [page, setPage] = React.useState(0)
  const [productsPerPage, setProductsPerPage] = React.useState(10)

  const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
    const selectedIndex = selected.indexOf(name)
    let newSelected: string[] = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1))
    }
    setSelected(newSelected)
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeProductsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProductsPerPage(+event.target.value)
    setPage(0)
  }

  const isSelected = (name: string) => selected.indexOf(name) !== -1

  // TODO Feature 1: Display data in a rich text table
  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          selected={selected}
          setSelected={setSelected}
          setCompared={setCompared}
          compared={compared}
          product={selected}
        />
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table">
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              rowCount={products.length}
              properties={productProperties}
              compared={compared}
              selected={selected}
            />
            <TableBody>
              {products
                .slice(page * productsPerPage, page * productsPerPage + productsPerPage)
                .map((product, productIdx) => {
                  const isItemSelected = isSelected(product)
                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, product)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={`tr${productIdx}`}
                      selected={isItemSelected}
                    >
                      {productProperties.map((productProperty, productPropertyIdx) => (
                        <TableCell key={`trc${productPropertyIdx}`} align="center">
                          {product[productProperty.name] === undefined ? '-' : product[productProperty.name]}
                        </TableCell>
                      ))}
                    </TableRow>
                  )
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={products.length}
          rowsPerPage={productsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeProductsPerPage}
        />
      </Paper>
    </div>
  )

  // TODO Feature 2: Compare two data
}
