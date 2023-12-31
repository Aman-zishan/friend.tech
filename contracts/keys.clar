
;; title: keys
;; version: 1.0.0
;; summary: Core contract of sFriend.Tech. sFriend.tech is a clone application of friend.tech in stacks
;; description: This contracts contains all the core functions of the key mechanism, the pricing model follows a quadratic formula 
;; to calculate the price of a key based on supply trends.

;; traits
;;

;; token definitions
;; 

;; constants
;;
(define-constant contract-owner tx-sender)

;; errors
;;
(define-constant err-unauthorised (err u401))
;; Only the shares' subject can buy the first share
(define-constant err-first-buy (err u500))
;; Insufficient payment
(define-constant err-insufficient-payment (err u501))
;; Insufficient contract balance
(define-constant err-insufficient-contract-balance (err u502))
;; Cannot sell last share
(define-constant err-cannot-sell-last-share (err u503))
;; Insufficient shares
(define-constant err-insufficient-shares (err u504))
;; Generic invalid value
(define-constant err-invalid-value (err u505))

;; data vars
;;
(define-data-var protocolFeePercent uint u10) 
(define-data-var subjectFeePercent uint u10)  
(define-data-var protocolFeeDestination principal contract-owner)

;; data maps
;;
(define-map keysBalance { subject: principal, holder: principal } uint)
(define-map keysSupply { subject: principal } uint)

;; public functions
;;

(define-public (set-protocol-fee-percent (feePercent uint))
  
  (begin 
  ;; Check if the caller is the contractOwner
  (asserts! (is-eq contract-owner tx-sender) err-unauthorised)
  (asserts! (> feePercent u0) err-invalid-value)
  ;; Update the protocolFeePercent value
  (ok (var-set protocolFeePercent feePercent))
  )
  
)

(define-public (set-subject-fee-percent (feePercent uint))
  
  (begin 
  ;; Check if the caller is the contractOwner
  (asserts! (is-eq contract-owner tx-sender) err-unauthorised)
  (asserts! (> feePercent u0) err-invalid-value)
  ;; Update the subjectFeePercent value
  (ok (var-set subjectFeePercent feePercent))
  )
  
)

(define-public (set-protocol-fee-destination (destination principal))
  
  (begin 
  ;; Check if the caller is the contractOwner
  (asserts! (is-eq contract-owner tx-sender) err-unauthorised)

  ;; Update the protocolFeePercent value
  (ok (var-set protocolFeeDestination destination))
  )
  
)

(define-public (buy-keys (subject principal) (amount uint)) 
  (let 
  (
    (supply (get-keys-supply subject))
    (price (get-price supply amount))
    (protocolFee (/ (* price (var-get protocolFeePercent)) u1000000))
    (subjectFee (/ (* price (var-get subjectFeePercent)) u1000000))
    
  )
 
  (asserts! (or (> supply u0) (is-eq tx-sender subject)) err-first-buy)
  (asserts! (> (stx-get-balance tx-sender) (+ price protocolFee subjectFee)) err-insufficient-payment)
  ;; Retain base amount in contract itself
  (print {supply: supply, price:price, protocolFee:protocolFee, subjectFee:subjectFee, amount: amount})
  ;; Allow a subject to buy his first key
  (if (> price u0)
      (begin
        ;; Retain base amount in contract itself
        (try! (stx-transfer? price tx-sender (as-contract tx-sender)))
        ;; Send protocol fee to protocol contract
        (try! (stx-transfer? protocolFee tx-sender (var-get protocolFeeDestination)))
        ;; Send subject fee to subject
        (try! (stx-transfer? subjectFee tx-sender subject))
      )
      true
    )

  (map-set keysBalance { subject: subject, holder: tx-sender }
    (+ (default-to u0 (map-get? keysBalance { subject: subject, holder: tx-sender })) amount)
  )
  (map-set keysSupply { subject: subject } (+ supply amount))
  (ok true)
  )
)

(define-public (sell-keys (subject principal) (amount uint)) 
  (let 
  (
    (balance (get-keys-balance subject tx-sender))
    (supply (get-keys-supply subject))
    (price (get-price (- supply amount) amount))
    (protocolFee (/ (* price (var-get protocolFeePercent)) u1000000))
    (subjectFee (/ (* price (var-get subjectFeePercent)) u1000000))
    (recipient tx-sender)
  )
  (asserts! (> supply amount) err-cannot-sell-last-share)
  (asserts! (>= balance amount) err-insufficient-shares)
  ;;(asserts! (> (stx-get-balance (as-contract tx-sender)) (+ price protocolFee subjectFee)) err-insufficient-contract-balance)

  ;; Send final price to tx-senders
  (try! (as-contract (stx-transfer? (- price protocolFee subjectFee) tx-sender recipient)))
  ;; Send protocol fee to protocol contract
  (try! (as-contract (stx-transfer? protocolFee tx-sender (var-get protocolFeeDestination))))
  ;; Send subject fee to subject
  (try! (as-contract (stx-transfer? subjectFee tx-sender subject)))

  (map-set keysBalance { subject: subject, holder: tx-sender } (- balance amount))
  (map-set keysSupply { subject: subject } (- supply amount))
  (ok true)
  )
)

(define-read-only (get-price (supply uint) (amount uint))
  (let 
    (
      (sum1 (if (is-eq supply u0)
                u0
                (/ (* (* (- supply u1) supply) (+ (* u2 (- supply u1)) u1)) u6)))
      (sum2 (if (and (is-eq supply u0) (is-eq amount u1))
                u0
                (/ (* (* (+ (- supply u1) amount) (+ supply amount)) (+ (* u2 (+ (- supply u1) amount )) u1)) u6)))
      (summation (- sum2 sum1))
    )
    (/ (* summation u1000000) u16) 
 
  )
)

(define-read-only (is-keyholder (subject principal) (holder principal))
  (>= (default-to u0 (map-get? keysBalance { subject: subject, holder: holder })) u1)
)

(define-read-only (get-keys-balance (subject principal) (holder principal))
  ;; Return the keysBalance for the given subject and holder
  (default-to u0 (map-get? keysBalance { subject: subject, holder: holder }))
)

(define-read-only (get-keys-supply (subject principal))
  ;; Return the keysSupply for the given subject
  (default-to u0 (map-get? keysSupply { subject: subject }))
)

(define-read-only (get-buy-price (subject principal) (amount uint))

  (let
    (
      (supply (get-keys-supply subject))
    )
     (get-price supply amount)
  )
)

(define-read-only (get-sell-price (subject principal) (amount uint))

  (let
    (
      (supply (get-keys-supply subject))
    )
    (get-price (- supply amount) amount)
  )
)

(define-read-only (get-buy-price-after-fee (subject principal) (amount uint))

  (let
    (
      (price (get-buy-price subject amount))
      (protocolFee (/ (* price (var-get protocolFeePercent)) u100))
      (subjectFee (/ (* price (var-get subjectFeePercent)) u100))
    )
    (+ price protocolFee subjectFee)
  )
)

(define-read-only (get-sell-price-after-fee (subject principal) (amount uint))

  (let
    (
      (price (get-sell-price subject amount))
      (protocolFee (/ (* price (var-get protocolFeePercent)) u100))
      (subjectFee (/ (* price (var-get subjectFeePercent)) u100))
    )
    (- price protocolFee subjectFee)
  )
)

;; helper functions
(define-read-only (get-owner)
  (ok contract-owner)
)

(define-read-only (get-protocol-fee-destination)
  (ok (var-get protocolFeeDestination))
)

(define-read-only (get-protocol-fee-percent)
  (ok (var-get protocolFeePercent))
)

(define-read-only (get-subject-fee-percent)
  (ok (var-get subjectFeePercent))
)

;; private functions
;;

