
;; title: keys
;; version:
;; summary:
;; description:

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

;; data vars
;;
(define-data-var protocolFeePercent uint u5) 
(define-data-var subjectFeePercent uint u5)  
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
  ;; Update the protocolFeePercent value
  (ok (var-set protocolFeePercent feePercent))
  )
  
)

(define-public (set-subject-fee-percent (feePercent uint))
  
  (begin 
  ;; Check if the caller is the contractOwner
  (asserts! (is-eq contract-owner tx-sender) err-unauthorised)
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
      (supply (default-to u0 (map-get? keysSupply { subject: subject })))
      (price (get-price supply amount))
    )
    (if (or (> supply u0) (is-eq tx-sender subject))
      (begin
        (match (stx-transfer? price tx-sender (as-contract tx-sender))
          success
          (begin
            (map-set keysBalance { subject: subject, holder: tx-sender }
              (+ (default-to u0 (map-get? keysBalance { subject: subject, holder: tx-sender })) amount)
            )
            (map-set keysSupply { subject: subject } (+ supply amount))
            (ok true)
          )
          error
          (err u2)
        )
      )
      (err u1)
    )
  )
)

(define-public (sell-keys (subject principal) (amount uint))
  (let
    (
      (balance (default-to u0 (map-get? keysBalance { subject: subject, holder: tx-sender })))
      (supply (default-to u0 (map-get? keysSupply { subject: subject })))
      (price (get-price supply amount))
      (recipient tx-sender)
    )
    (if (and (>= balance amount) (or (> supply u0) (is-eq tx-sender subject)))
      (begin
        (match (as-contract (stx-transfer? price tx-sender recipient))
          success
          (begin
            (map-set keysBalance { subject: subject, holder: tx-sender } (- balance amount))
            (map-set keysSupply { subject: subject } (- supply amount))
            (ok true)
          )
          error
          (err u2)
        )
      )
      (err u1)
    )
  )
)


;; read only functions
;;
(define-read-only (get-price (supply uint) (amount uint))
  (let
    (
      (base-price u10)
      (price-change-factor u100)
      (adjusted-supply (+ supply amount))
    )
    (+ base-price (* amount (/ (* adjusted-supply adjusted-supply) price-change-factor)))
  )
)

(define-read-only (is-keyholder (subject principal) (holder principal))
  (>= (default-to u0 (map-get? keysBalance { subject: subject, holder: holder })) u1)
)

(define-read-only (get-keys-balance (subject principal) (holder principal))
  ;; Return the keysBalance for the given subject and holder
  (map-get? keysBalance (tuple (subject subject) (holder holder)))
)

(define-read-only (get-keys-supply (subject principal))
  ;; Return the keysSupply for the given subject
  (map-get? keysSupply (tuple (subject subject)))
)

(define-read-only (get-buy-price (subject principal) (amount uint))
  ;; Implement buy price logic
  (let
    (
      (supply (unwrap! (get-keys-supply subject) (err u3)))
    )
    (ok (get-price supply amount))
  )
)

(define-read-only (get-sell-price (subject principal) (amount uint))
  ;; Implement sell price logic
  (let
    (
      (supply (unwrap! (get-keys-supply subject) (err u4)))
    )
    (ok (get-price (- supply amount) amount))
  )
)

(define-read-only (get-buy-price-after-fee (subject principal) (amount uint))
  ;; Implement buy price logic
  (let
    (
      (price (unwrap! (get-buy-price subject amount) (err u3)))
      (protocolFee (/ (* price (var-get protocolFeePercent)) u100))
      (subjectFee (/ (* price (var-get subjectFeePercent)) u100))
    )
    (ok (+ price protocolFee subjectFee))
  )
)

(define-read-only (get-sell-price-after-fee (subject principal) (amount uint))
  ;; Implement sell price logic
  (let
    (
      (price (unwrap! (get-sell-price subject amount) (err u3)))
      (protocolFee (/ (* price (var-get protocolFeePercent)) u100))
      (subjectFee (/ (* price (var-get subjectFeePercent)) u100))
    )
    (ok (- price protocolFee subjectFee))
  )
)

;; private functions
;;

