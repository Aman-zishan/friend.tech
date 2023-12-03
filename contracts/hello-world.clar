
;; title: hello-world
;; version:
;; summary:
;; description:

;; traits
;;

;; token definitions
;; 

;; constants
;;

;; data vars
;;

;; data maps
;;

;; public functions
;;
(define-public (pay (recipient principal)) 
(stx-transfer? u0 tx-sender recipient)
)

;; read only functions
;;
(define-read-only (get-price (supply uint) (amount uint))
(/ (* (* (+ (- amount u1) supply) (+ supply amount)) (+ (* u2 (+ (- amount u1) supply )) u1)) u6)
)

;; private functions
;;

