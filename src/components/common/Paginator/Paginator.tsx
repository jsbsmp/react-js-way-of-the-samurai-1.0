import { useState } from 'react';
import styles from './Paginator.module.css';
import cn from 'classnames';

type PaginatorPropsType = {
    totalItemsCount: number
    pageSize: number
    currentPage?: number
    onPageChanged?: (pageNumber: number) => void
    portionSize?: number
}

let Paginator: React.FC<PaginatorPropsType> = ({ totalItemsCount, pageSize, currentPage = 1, onPageChanged = () => {}, portionSize = 10 }) => {

    let pagesCount = Math.ceil(totalItemsCount / pageSize);

    let pages = [];
    for (let i = 1; i <= pagesCount; i++) {
        pages.push(i);
    }

    let portionCount = Math.ceil(pagesCount / portionSize);
    let [portionNumber, setPortionNumber] = useState<number>(Math.ceil(currentPage / portionSize));
    let leftPortionPageNumber = (portionNumber - 1) * portionSize + 1;
    let rightPortionPageNumber = portionNumber * portionSize;

    return <div className={styles.paginator}>
        {portionNumber > 1 && <button onClick={() => { setPortionNumber(portionNumber - 1) }}>PREV</button>}
        {pages.filter(p => p >= leftPortionPageNumber && p <= rightPortionPageNumber)
            .map((p) => {
                return <span key={p} className={cn({
                    [styles.selectedPage]: currentPage === p
                }, styles.pageNumber)} onClick={(e) => { onPageChanged(p) }}>{p}</span>
            })}
        {portionCount > portionNumber && <button onClick={() => { setPortionNumber(portionNumber + 1) }}>NEXT</button>}
    </div>
}

export default Paginator;