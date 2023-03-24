-- This is an empty migration.
DROP VIEW IF EXISTS "ProductsSelled" ; 
CREATE OR REPLACE view  "ProductsSold" as (	
	
	SELECT p1.id , 
	(
		SELECT COALESCE(sum(ci1.quantity)::int,0) FROM public."CartItem" ci1 
		LEFT JOIN public."Cart" cr1 On cr1.uuid = ci1."cartId"
		WHERE  ci1."productId" = p1.id and cr1.state = false  
	) as sold
	FROM public."Product" p1 
	ORDER BY sold DESC 
) ;

