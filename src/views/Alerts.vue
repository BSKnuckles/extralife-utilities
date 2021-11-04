<template>
    <div>
        <video v-if="rolling" width="1920" height="1080" autoplay>
            <source src="/HighRoller.mp4" type="video/mp4" />
        </video>
        <button
            @click="testNotification"
            class="
                absolute
                bottom-0
                right-0
                bg-transparent
                text-transparent
                p-8
            "
        >
            Test Notificaton
        </button>
    </div>
</template>

<script>
import Moment from 'moment'
import { ref } from 'vue'
import HighRoller from '@/assets/HighRoller.mp4'

export default {
    setup() {
        const options = {
            autoplay: true,
            controls: false,
            sources: [
                {
                    src: HighRoller,
                    type: 'video/mp4',
                },
            ],
        }
        const refresh = 60000
        const participantId = 451384
        const rolling = ref(false)
        const url = `https://extra-life.org/api/participants/${participantId}/donations`

        const testNotification = () => {
            console.log('Triggering test notification')
            rolling.value = true
            setTimeout(() => {
                rolling.value = false
            }, 15000)
        }

        const fetchDonations = () => {
            fetch(url)
                .then((res) => res.json())
                .then((data) => {
                    let highRollers = data.filter((donation) => {
                        let donationTime = Moment(donation.createdDateUTC)
                        let reference = Moment()
                        if (
                            donation.amount >= 100 &&
                            reference.diff(donationTime) <= refresh
                        ) {
                            return true
                        }
                    })
                    if (highRollers.length > 0) {
                        rolling.value = true
                    }
                })
                .finally(() => {
                    setTimeout(() => {
                        rolling.value = false
                    }, 15000)
                })
        }
        // Fetch donations at the refresh rate
        setInterval(() => {
            console.log('Fetching donations', new Date())
            fetchDonations()
        }, refresh)

        return { rolling, options, testNotification }
    },
}
</script>

<style>
body {
    background-color: transparent;
}
</style>
