import React from 'react'
import "./process.css"
const Process = () => {
    const step = [{
        number: "01",
        title: "Create your Account",
        description: "Free sign-up with email or Google. Zero waiting, zero approval process.",
    },
    {
        number: "02",
        title: "Pick a Task",
        description:
            "Browse surveys, games, videos, app installs — hundreds of new tasks added daily.",
    },
    {
        number: "03",
        title: "Get Paid Daily",
        description:
            "Cash out via PayPal, crypto, or gift cards every single day without waiting.",
    },
    ];

    return (
        <section className='process'>
            <div className='container'>
                <span className='section-tag'>THE PROCESS</span>
                <h2 className='section-title'>
                    3 steps to your first payout
                </h2>
                <p className='section-subtitle'>
                    Takes under 2 minutes to set up and earn your very first reward today.
                </p>
                <div className='steps'>
                    {step.map((step) => (
                        <div className='step' key={step.number}>
                            <div className='step-number'>{step.number}</div>
                            <h3>{step.title}</h3>
                            <p>{step.description}</p>
                        </div>
                    ))}

                </div>
            </div>

        </section>
    )
}

export default Process