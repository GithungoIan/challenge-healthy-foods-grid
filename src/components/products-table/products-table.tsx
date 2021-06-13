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
import { Button, IconButton, lighten, Theme, Toolbar, Tooltip, Typography } from '@material-ui/core'
import clsx from 'clsx'
import ClearAllIcon from '@material-ui/icons/ClearAll'

interface SelectedTableProps {
  productsProperties: any
  products: any
}

const comparedProducts = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%'
    },
    highlight: {}
  })
)

// TODO if selected[0] highlight red else if selected[1] highlight blue
// TODO display in a single row both products currently working with two rows refactor code to fit one row
// TODO fix toolbar alignment padding : spacing (2), (1)

function SelectedProducts(props: SelectedTableProps) {
  const { productsProperties, products } = props
  const classes = comparedProducts()
  return (
    <TableHead>
      {products.map((product, productIdx) => {
        return (
          <TableRow key={productIdx}>
            {productsProperties.map((productProperty, productPropertyIdx) => (
              <TableCell key={`trc${productPropertyIdx}`} align="center">
                {product[productProperty.name]}
              </TableCell>
            ))}
          </TableRow>
        )
      })}
    </TableHead>
  )
}

interface EnhancedTableProps {
  classes: ReturnType<typeof useStyles>
  numSelected: number
  rowCount: number
  properties: any
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { properties } = props

  return (
    <TableHead>
      <TableRow>
        {properties.map((property) => (
          <TableCell key={property.id} align="center" style={{ minWidth: 130 }}>
            {property.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

const useToolbarStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1)
    },
    roots: {
      ...theme.typography.button,
      backgroundColor: theme.palette.background.paper,
      padding: theme.spacing(1),
      margin: theme.spacing(1)
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
    }
  })
)

interface EnhancedTableToolbarProps {
  numSelected: number
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const classes = useToolbarStyles()
  const { numSelected } = props
  return (
    <Toolbar className={classes.root}>
      {numSelected > 0 ? (
        <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
          <Tooltip title="Clear list">
            <IconButton aria-label="clear list">
              <ClearAllIcon />
            </IconButton>
          </Tooltip>
          {numSelected} selected
        </Typography>
      ) : (
        <Tooltip title="Clear list">
          <IconButton disabled aria-label="clear list">
            <ClearAllIcon />
          </IconButton>
        </Tooltip>
      )}
      {numSelected > 1 && numSelected < 3 ? (
        <Tooltip title="Compare Products" placement="top-end">
          <Button variant="contained">Compare products</Button>
        </Tooltip>
      ) : numSelected < 2 ? (
        <Tooltip title="Select 2 Products" placement="right-start">
          <Button disabled variant="contained">
            select 2 products to compare
          </Button>
        </Tooltip>
      ) : (
        <Tooltip title="Select 2 Products" placement="right-start">
          <Button disabled variant="contained">
            select 2 products to compare
          </Button>
        </Tooltip>
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
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table">
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              rowCount={products.length}
              properties={productProperties}
            />
            {selected.length > 1 && selected.length < 3 ? (
              <SelectedProducts productsProperties={productProperties} products={selected} />
            ) : (
              []
            )}
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
                          {product[productProperty.name] === ' ' ? '-' : product[productProperty.name]}
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
  return <div>TODO</div>
}
