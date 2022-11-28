import React from 'react'

import Categories from '../components/Categories'
import Sort from '../components/Sort'
import PizzaBlock from '../components/PizzaBlock/PizzaBlock'
import Skeleton from '../components/PizzaBlock/Skeleton'
import Pagination from '../components/Pagination/Pagination'
import { SearchContext } from '../App'

const Home = () => {
	const { searchValue } = React.useContext(SearchContext)
	const [items, setItems] = React.useState([])
	const [isLoading, setIsLoading] = React.useState(true)
	const [categoriesId, setCategoriesId] = React.useState(0)
	const [currentPage, setCurrentPage] = React.useState(1)
	const [sortType, setSortType] = React.useState({
		name: 'популярности',
		sortProperty: 'rating',
	})

	React.useEffect(() => {
		setIsLoading(true)

		const sortBy = sortType.sortProperty.replace('-', '')
		const order = sortType.sortProperty.includes('-') ? 'asc' : 'desc'
		const category = categoriesId > 0 ? `category=${categoriesId}` : ''
		const search = searchValue ? `&search=${searchValue}` : ''

		fetch(
			`https://637ce5cd72f3ce38eab0ecc7.mockapi.io/items?page=${currentPage}&limit=4&${category}&sortBy=${sortBy}&order=${order}${search}`
		)
			.then(res => res.json())
			.then(arr => {
				setItems(arr)
				setIsLoading(false)
			})
		window.scrollTo(0, 0)
	}, [categoriesId, sortType, searchValue, currentPage])

	const pizzas = items.map(obj => <PizzaBlock key={obj.id} {...obj} />)

	const skeletons = [...new Array(6)].map((_, index) => (
		<Skeleton key={index} />
	))

	return (
		<>
			<div className='content__top'>
				<Categories
					value={categoriesId}
					onClickCategory={i => setCategoriesId(i)}
				/>
				<Sort value={sortType} onChangeSort={i => setSortType(i)} />
			</div>
			<h2 className='content__title'>Все пиццы</h2>
			<div className='content__items'>{isLoading ? skeletons : pizzas}</div>
			<Pagination onChangePage={number => setCurrentPage(number)} />
		</>
	)
}

export default Home
