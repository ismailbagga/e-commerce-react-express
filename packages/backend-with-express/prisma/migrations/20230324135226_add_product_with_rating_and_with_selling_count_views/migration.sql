CREATE OR REPLACE view  "ProductsSelled" as (	
	SELECT p1.* , count(cr1.uuid) as selled  FROM public."Product" p1 
	LEFT JOIN public."CartItem" ci1 On ci1."productId" = p1.id
	LEFT JOIN public."Cart" cr1 On cr1.uuid = ci1."cartId" And cr1.state = False
	GROUP BY  p1.id 
	ORDER BY selled DESC 
) ;

	
CREATE OR Replace View "ProductRating" as 
(

	SELECT p1.* ,
	CASE 
		WHEN count(r1."userId")  = 0 THEN 0::decimal(5,2)
		ELSE ( sum(r1.rating) / count(r1."userId") ) ::decimal(5,2)
	END
	as rating  , 
	count(r1."userId")::int as total_votes 
	
	FROM public."Product" as p1
	LEFT JOIN public.rating r1 ON p1.id = r1."productId"
	GROUP BY p1.id 
	ORDER BY rating DESC 
) ;

