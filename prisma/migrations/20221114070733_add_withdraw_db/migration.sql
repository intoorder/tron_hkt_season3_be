-- CreateTable
CREATE TABLE "withdrawal" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "address" TEXT NOT NULL,
    "amount" DECIMAL(30,18) NOT NULL DEFAULT 0,
    "fee" DECIMAL(30,18) NOT NULL DEFAULT 0,
    "tx_address" TEXT,
    "tx_hash" TEXT,
    "status" INTEGER,
    "message" TEXT,
    "block_hash" TEXT,
    "block_number" TEXT,
    "confirms" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "withdrawal_pkey" PRIMARY KEY ("id")
);
